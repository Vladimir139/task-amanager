import { FiberManualRecordRounded, MicNone, StopRounded } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import styles from "./VoiceRecorderButton.module.scss";

export interface RecordedAudioPayload {
  durationMs: number;
  file: File;
  waveform?: string;
}

interface VoiceRecorderButtonProps {
  disabled?: boolean;
  onRecorded: (payload: RecordedAudioPayload) => Promise<void> | void;
}

const getRecordingMimeType = (): string => {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  const supportedMimeTypes = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"];

  return supportedMimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? "";
};

const getFileExtension = (mimeType: string): string => {
  if (mimeType.includes("mp4")) {
    return "m4a";
  }

  if (mimeType.includes("ogg")) {
    return "ogg";
  }

  return "webm";
};

const formatDuration = (durationMs: number): string => {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const buildWaveform = async (blob: Blob): Promise<string | undefined> => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return undefined;
  }

  const audioContext = new AudioContextClass();

  try {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const channel = audioBuffer.getChannelData(0);
    const bucketSize = Math.max(1, Math.floor(channel.length / 24));
    const waveform = Array.from({ length: 24 }, (_value, index) => {
      const start = index * bucketSize;
      const slice = channel.slice(start, start + bucketSize);

      if (slice.length === 0) {
        return 12;
      }

      const rms = Math.sqrt(slice.reduce((sum, sample) => sum + sample * sample, 0) / slice.length);

      return Math.max(6, Math.min(100, Math.round(rms * 180)));
    });

    return JSON.stringify(waveform);
  } catch {
    return undefined;
  } finally {
    void audioContext.close();
  }
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export const VoiceRecorderButton: FC<VoiceRecorderButtonProps> = ({
  disabled = false,
  onRecorded,
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);
  const [recordingDurationMs, setRecordingDurationMs] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const cleanupRecorder = () => {
    if (recordingIntervalRef.current) {
      window.clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    mediaRecorderRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
    mediaStreamRef.current = null;
    recordingStartedAtRef.current = null;
  };

  useEffect(() => {
    return () => {
      cleanupRecorder();
    };
  }, []);

  const statusText = useMemo(() => {
    if (isProcessing) {
      return "Preparing audio...";
    }

    if (isRecording) {
      return formatDuration(recordingDurationMs);
    }

    return null;
  }, [isProcessing, isRecording, recordingDurationMs]);

  const handleStartRecording = async (): Promise<void> => {
    if (disabled || isProcessing || isRecording) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      toast.error("Voice recording is not supported in this browser.");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getRecordingMimeType();
      const mediaRecorder = mimeType
        ? new MediaRecorder(mediaStream, { mimeType })
        : new MediaRecorder(mediaStream);
      const chunks: Blob[] = [];

      mediaStreamRef.current = mediaStream;
      mediaRecorderRef.current = mediaRecorder;
      recordingStartedAtRef.current = Date.now();
      setRecordingDurationMs(0);
      setIsRecording(true);

      recordingIntervalRef.current = window.setInterval(() => {
        const startedAt = recordingStartedAtRef.current;

        if (!startedAt) {
          return;
        }

        setRecordingDurationMs(Date.now() - startedAt);
      }, 250);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const durationMs = Math.max(
          1000,
          Date.now() - (recordingStartedAtRef.current ?? Date.now()),
        );
        const recordingMimeType = mediaRecorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunks, {
          type: recordingMimeType,
        });

        cleanupRecorder();
        setIsRecording(false);
        setRecordingDurationMs(durationMs);

        if (blob.size === 0) {
          setIsProcessing(false);
          toast.error("The recording is empty.");
          return;
        }

        try {
          const waveform = await buildWaveform(blob);
          const extension = getFileExtension(recordingMimeType);
          const file = new File([blob], `voice-message-${Date.now()}.${extension}`, {
            type: recordingMimeType,
          });

          await onRecorded({
            durationMs,
            file,
            waveform,
          });
        } catch {
          toast.error("Unable to send the recorded audio.");
        } finally {
          setIsProcessing(false);
          setRecordingDurationMs(0);
        }
      };

      mediaRecorder.start();
    } catch {
      cleanupRecorder();
      setIsRecording(false);
      setIsProcessing(false);
      toast.error("Microphone access was denied.");
    }
  };

  const handleStopRecording = (): void => {
    if (!isRecording || !mediaRecorderRef.current) {
      return;
    }

    setIsProcessing(true);
    mediaRecorderRef.current.stop();
  };

  return (
    <Box className={styles.recorder}>
      <IconButton
        aria-label={isRecording ? "Stop recording" : "Record voice message"}
        onClick={isRecording ? handleStopRecording : () => void handleStartRecording()}
        disabled={disabled || isProcessing}
        className={`${styles.recordButton} ${
          isRecording ? styles.recordingButton : isProcessing ? styles.processingButton : ""
        }`}
      >
        {isProcessing ? (
          <CircularProgress size={18} />
        ) : isRecording ? (
          <StopRounded />
        ) : (
          <MicNone />
        )}
      </IconButton>

      {statusText && (
        <Box className={styles.recorder}>
          {isRecording && <FiberManualRecordRounded fontSize="small" color="error" />}
          <Typography className={`${styles.status} ${isRecording ? styles.recordingStatus : ""}`}>
            {statusText}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
