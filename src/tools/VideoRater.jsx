import { useState, useEffect } from "react";
import axios from "axios";

export function VideoRater() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [transcriptUrl, setTranscriptUrl] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [queuePosition, setQueuePosition] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please choose a video file.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);
    setTranscriptUrl(null);
    setQueuePosition(null);

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await axios.post(
        "https://video-rating-ai-production.up.railway.app/api/rate",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setJobId(response.data.job_id);
      setQueuePosition(response.data.queue_position);
    } catch (err) {
      console.error(err);
      setError(
        "An error occurred while processing the video. Please try again.",
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const poll = setInterval(async () => {
      try {
        const res = await axios.get(
          `https://video-rating-ai-production.up.railway.app/api/status/${jobId}`,
        );
        if (res.data.status === "done") {
          setResult(res.data.result);
          setTranscriptUrl(
            "https://video-rating-ai-production.up.railway.app/api_transcript",
          );
          setJobId(null);
          setLoading(false);
        } else if (res.data.status === "error") {
          setError(res.data.error);
          setJobId(null);
          setLoading(false);
        } else {
          setQueuePosition(res.data.queue_position);
        }
      } catch {
        // keep polling on transient network errors
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [jobId]);

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h1 className="flex flex-col items-center justify-normal mt-2">
        AI Video Rater
      </h1>
      <h3 className="mb-4">
        If the script score is -1, it means the AI errored out and could not
        give a rating. This tool only works for English videos shorter than 30
        minutes. Sometimes due to cold starting the server it may take a while
        to respond. Doesn&apos;t work if the video is too big (1gb+).
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row mb-4">
          <label>
            Video file:
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="ml-1"
            />
          </label>
        </div>
        <div className="flex flex-row items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 dark:bg-blue-800 p-2 my-1 rounded-md hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700"
          >
            {loading
              ? queuePosition
                ? `Processing... (position ${queuePosition})`
                : "Uploading..."
              : "Submit"}
          </button>
        </div>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div className="flex flex-col items-center justify-center">
          <div
            dangerouslySetInnerHTML={{ __html: result }}
            className="flex flex-col my-2"
          />
          {transcriptUrl && (
            <a
              href={transcriptUrl}
              download
              className="bg-cyan-500 dark:bg-blue-800 p-2 my-1 rounded-md hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700"
            >
              Download Transcript
            </a>
          )}
        </div>
      )}
    </div>
  );
}
