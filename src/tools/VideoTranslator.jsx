import { useState } from "react";
import axios from "axios";

export function VideoTranslator() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  async function uploadVideo(file, language) {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("language", language);

    const res = await axios.post(
      "https://video-language-changer-production.up.railway.app/api/translate",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return res.data; // { transcript: "...", translated: "..." }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please choose a video file.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);
    let data;
    try {
      data = await uploadVideo(file, language);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
    try {
      const audio = await getAudio(data.translated, language);
      setAudioUrl(audio);
    } catch (err) {
      console.error(err);
      setAudioError("Audio generation failed. Please try again.");
    } finally {
      setAudioLoading(false);
    }
  };
  async function getAudio(text, language) {
    const res = await axios.post(
      "https://video-language-changer-production.up.railway.app/api/audio",
      { text, language },
      { responseType: "blob" },
    );
    const blob = new Blob([res.data], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    return url;
  }

  return (
    <>
      <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
        <h1 className="flex flex-col items-center justify-normal mt-2">
          Video Translator
        </h1>
        <h3 className="mb-4">
          Translates your videos to different language and outputs an audio file
          of your video in the desired language. If the transcript is empty that
          means the audio couldn&apos;t be understood. The audio may take a
          while to be made because of cold starting the server, sorry about
          that. The program may fail at times due to the AI calls getting rate
          limited, just try again. If the video is too big( 1gb+) it
          doesn&apos;t work at all, so try to keep it under that.
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row mb-4">
            <label>
              Video file:
              <input
                className="ml-1"
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>

          <div className="mb-4">
            <label>
              Target language:
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="m-2 p-2 bg-neutral-200 text-slate-900 dark:bg-slate-900 dark:text-neutral-200 border rounded"
              >
                <option value="English">English</option>
                <option value="Catalan">Catalan</option>
                <option value="Czech">Czech</option>
                <option value="Welsh">Welsh</option>
                <option value="Danish">Danish</option>
                <option value="German">German</option>
                <option value="Spanish">Spanish</option>
                <option value="Greek">Greek</option>
                <option value="Estonian">Estonian</option>
                <option value="Basque">Basque</option>
                <option value="Finnish">Finnish</option>
                <option value="French">French</option>
                <option value="Galician">Galician</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Hausa">Hausa</option>
                <option value="Croatian">Croatian</option>
                <option value="Hungarian">Hungarian</option>
                <option value="Indonesian">Indonesian</option>
                <option value="Icelandic">Icelandic</option>
                <option value="Italian">Italian</option>
                <option value="Hebrew">Hebrew</option>
                <option value="Japanese">Japanese</option>
                <option value="Javanese">Javanese</option>
                <option value="Khmer">Khmer</option>
                <option value="Kannada">Kannada</option>
                <option value="Korean">Korean</option>
                <option value="Latin">Latin</option>
                <option value="Lithuanian">Lithuanian</option>
                <option value="Latvian">Latvian</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Marathi">Marathi</option>
                <option value="Malay">Malay</option>
                <option value="Hindi">Hindi</option>
                <option value="Myanmar (Burmese)">Myanmar (Burmese)</option>
                <option value="Nepali">Nepali</option>
                <option value="Dutch">Dutch</option>
                <option value="Norwegian">Norwegian</option>
                <option value="Punjabi (Gurmukhi)">Punjabi (Gurmukhi)</option>
                <option value="Polish">Polish</option>
                <option value="Portuguese (Brazil)">Portuguese (Brazil)</option>
                <option value="Portuguese (Portugal)">
                  Portuguese (Portugal)
                </option>
                <option value="Romanian">Romanian</option>
                <option value="Russian">Russian</option>
                <option value="Sinhala">Sinhala</option>
                <option value="Slovak">Slovak</option>
                <option value="Albanian">Albanian</option>
                <option value="Serbian">Serbian</option>
                <option value="Sundanese">Sundanese</option>
                <option value="Swedish">Swedish</option>
                <option value="Swahili">Swahili</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Thai">Thai</option>
                <option value="Filipino">Filipino</option>
                <option value="Turkish">Turkish</option>
                <option value="Ukrainian">Ukrainian</option>
                <option value="Urdu">Urdu</option>
                <option value="Vietnamese">Vietnamese</option>
                <option value="Cantonese">Cantonese</option>
                <option value="Chinese (Simplified)">
                  Chinese (Simplified)
                </option>
                <option value="Chinese (Mandarin/Taiwan)">
                  Chinese (Mandarin/Taiwan)
                </option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 dark:bg-blue-800 p-2 my-1 rounded-md hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700"
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {result && (
          <div>
            <p className="my-4">
              <strong>Transcript:</strong> {result.transcript}
            </p>
            <p className="my-4">
              <strong>Translated:</strong> {result.translated}
            </p>

            <a
              className="bg-cyan-500 dark:bg-blue-800 p-2 my-1 rounded-md hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700"
              disabled={audioLoading || !audioUrl}
              href={audioUrl}
              download="translated_audio.mp3"
            >
              {audioError ? audioError : "Download Audio"}
            </a>
          </div>
        )}
      </div>
    </>
  );
}
// scrapped due to memory issues on server side
// import React, { useState } from "react";
// import axios from "axios";

// export function VideoRater() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [transcriptUrl, setTranscriptUrl] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setError("Please choose a video file.");
//       return;
//     }

//     setError(null);
//     setLoading(true);
//     setResult(null);
//     setTranscriptUrl(null);

//     const formData = new FormData();
//     formData.append("video", file);

//     try {
//       const response = await axios.post(
//         "https://video-rating-ai.onrender.com/api/rate",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       setResult(response.data.result);
//       setTranscriptUrl("https://video-rating-ai.onrender.com/api_transcript");
//     } catch (err) {
//       console.error(err);
//       setError("An error occurred while processing the video. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
//       <h1 className="flex flex-col items-center justify-normal mt-2">AI Video Rater</h1>
//       <h3  className="mb-4">
//         If the script score is -1, it means the AI errored out and could not give a rating. This tool only works for English videos shorter than 30 minutes. Sometimes due to issues with server it may take a while to respond.
//       </h3>
//       <form onSubmit={handleSubmit}>
//         <div className="flex flex-row mb-4">
//           <label>
//             Video file:
//             <input
//               type="file"
//               accept="video/*"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="ml-1"
//             />
//           </label>
//         </div>
//         <div className="flex flex-row items-center justify-center">
//             <button type="submit" disabled={loading}  className="bg-cyan-500 dark:bg-blue-800 p-2 my-1 rounded-md hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700">
//               {loading ? "Uploading..." : "Submit"}
//             </button>
//         </div>
//       </form>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {result && (
//         <div className="flex flex-row items-center justify-center">
//           <div
//             dangerouslySetInnerHTML={{ __html: result }}
//             className="flex flex-col my-2"
//             />
//           {transcriptUrl && (
//             <a href={transcriptUrl} download
//             className="bg-cyan-500 dark:bg-blue-800 p-2 my-1 rounded-md hover:text-white dark:hover:text-black hover:bg-cyan-600 dark:hover:bg-blue-700"
//             >
//               Download Transcript
//             </a>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
