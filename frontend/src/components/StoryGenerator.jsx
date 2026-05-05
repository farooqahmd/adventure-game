import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom";
import axios from "axios";
import ThemeInput from "./ThemeInput.jsx";
import LoadingStatus from "./LoadingStatus.jsx";

const API_BASE_URL = "http://localhost:8000/api"  // ✅ define it here, remove util.js import

function StoryGenerator() {
    const navigate = useNavigate()
    const [theme, setTheme] = useState("")
    const [jobId, setJobId] = useState(null)
    const [jobStatus, setJobStatus] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let pollInterval;
        if (jobId && jobStatus === "pending" || jobStatus === "in_progress") {  // ✅ backend uses "pending"/"in_progress" not "processing"
            pollInterval = setInterval(() => {
                pollJobStatus(jobId)
            }, 5000)
        }
        return () => {
            if (pollInterval) clearInterval(pollInterval)
        }
    }, [jobId, jobStatus])

    const generateStory = async (theme) => {
        setLoading(true)
        setError(null)
        setTheme(theme)
        try {
            const response = await axios.post(`${API_BASE_URL}/stories/Create`, {theme}, {  // ✅ capital C in /Create
                withCredentials: true  // ✅ needed for session cookie
            })
            const {job_id, status} = response.data
            setJobId(job_id)
            setJobStatus(status)
            pollJobStatus(job_id)
        } catch (e) {
            setLoading(false)
            setError(`Failed to generate story: ${e.message}`)
        }
    }

    const pollJobStatus = async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/jobs/${id}`, {
                withCredentials: true  // ✅ needed for session cookie
            })
            const {status, story_id, error: jobError} = response.data
            setJobStatus(status)
            if (status === "completed" && story_id) {
                fetchStory(story_id)
            } else if (status === "failed" || jobError) {
                setError(jobError || "Failed to generate story")
                setLoading(false)
            }
        } catch (e) {
            if (e.response?.status !== 404) {
                setError(`Failed to check story status: ${e.message}`)
                setLoading(false)
            }
        }
    }

    const fetchStory = async (id) => {
        try {
            setLoading(false)
            setJobStatus("completed")
            navigate(`/story/${id}`)
        } catch (e) {
            setError(`Failed to load story: ${e.message}`)
            setLoading(false)
        }
    }

    const reset = () => {
        setJobId(null)
        setJobStatus(null)
        setError(null)
        setTheme("")
        setLoading(false)
    }

    return (
        <div className="story-generator">
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={reset}>Try Again</button>
                </div>
            )}
            {!jobId && !error && !loading && <ThemeInput onSubmit={generateStory}/>}
            {loading && <LoadingStatus theme={theme} />}
        </div>
    )
}

export default StoryGenerator