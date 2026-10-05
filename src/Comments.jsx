import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_ROUTES } from "./utils/apiRoutes";

// this will a while so I'll start by writing what it should do first
// This component is not in pages because it will be used in almost every page

// Function that takes in a PageName: string and then returns the comments for that page
// The comments will be stored in a database, my first choice is supabase

// I'm going to make a backend api route to handle the comments, so the component will call that route
// The api route will handle fetching and adding comments to the database

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [menuOpen, setMenuOpen] = useState(null); // Track which menu is open
  const [amountOfComments, setAmountOfComments] = useState(5);
  const [totalComments, setTotalComments] = useState(0);
  const [prevPage, setPrevPage] = useState("");
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true",
  );

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(localStorage.getItem("loggedIn") === "true");
  }, [location.pathname]);
  let page = location.pathname.substring(1);
  if (page !== prevPage) {
    setAmountOfComments(5);
    setPrevPage(page);
  }
  if (page === "") {
    page = "home";
  }

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(
          `${API_ROUTES.COMMENTS}?action=list&page=${encodeURIComponent(page)}&amount=${encodeURIComponent(amountOfComments)}`,
        );
        const data = await response.json();
        if (data.success) {
          setComments(data.comments);
        } else {
          console.error("Failed to fetch comments:", data.message);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    fetchComments();
  }, [page, amountOfComments]);
  useEffect(() => {
    async function fetchTotalComments() {
      try {
        const response = await fetch(
          `${API_ROUTES.COMMENTS}?action=total&page=${encodeURIComponent(page)}`,
        );
        const data = await response.json();
        if (data.success) {
          setTotalComments(data.totalComments);
        }
      } catch (error) {
        console.error("Error fetching total comments:", error);
      }
    }
    fetchTotalComments();
  }, [page]);
  async function handleAddComment(event) {
    event.preventDefault();
    if (!content) {
      alert("Please enter a comment.");
      return;
    }
    try {
      const response = await fetch(
        `${API_ROUTES.COMMENTS}?action=add&page=${encodeURIComponent(page)}&content=${encodeURIComponent(content)}`,
        {
          method: "POST",
        },
      );
      const data = await response.json();
      if (data.success) {
        // Refetch comments to include the new comment with its generated id
        const updatedComments = await fetch(
          `${API_ROUTES.COMMENTS}?action=list&page=${encodeURIComponent(page)}`,
        );
        const updatedData = await updatedComments.json();
        if (updatedData.success) {
          setComments(updatedData.comments);
        }
        setContent("");
      } else {
        if (response.headers.get("loggedIn") === "false") {
          localStorage.setItem("loggedIn", "false");
          setLoggedIn(false);
          alert("You must be logged in to add a comment.");
        }
        console.error("Failed to add comment:", data.message);
      }
    } catch (error) {
      localStorage.setItem("loggedIn", "false");
      console.error("Error adding comment:", error);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      const response = await fetch(
        `${API_ROUTES.COMMENTS}?action=delete&page=${encodeURIComponent(page)}&id=${encodeURIComponent(
          commentId,
        )}`,
        { method: "POST" },
      );
      const data = await response.json();
      if (data.success) {
        // Refetch comments to include the new comment with its generated id
        const updatedComments = await fetch(
          `${API_ROUTES.COMMENTS}?action=list&page=${encodeURIComponent(page)}`,
        );
        const updatedData = await updatedComments.json();
        if (updatedData.success) {
          setComments(updatedData.comments);
        }
      } else {
        console.error("Failed to delete comment:", data.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-card text-card-foreground rounded-lg shadow-md mt-8 border-2 border-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-foreground">Comments</h2>

        {loggedIn ? (
          <button
            onClick={() => navigate("/account")}
            className="bg-primary text-primary-foreground py-2 px-4 rounded-md shadow-lg hover:bg-accent hover:text-accent-foreground"
          >
            Account
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-primary-foreground py-2 px-4 rounded-md shadow-lg hover:bg-accent hover:text-accent-foreground"
          >
            Login
          </button>
        )}
      </div>
      <form onSubmit={handleAddComment} className="mb-6">
        <div className="mb-4">
          <textarea
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-input rounded-md focus:outline-hidden focus:ring-2 focus:ring-ring bg-inherit"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground"
        >
          Add Comment
        </button>
      </form>
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="p-4 bg-muted rounded-md shadow-xs relative"
          >
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{comment.username}</strong> -{" "}
              {new Date(comment.created_at).toLocaleString()}
            </p>
            <p className="text-foreground">{comment.content}</p>
            <button
              onClick={() =>
                setMenuOpen((prev) => (prev === comment.id ? null : comment.id))
              }
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              &#x22EE;
            </button>
            {menuOpen === comment.id && (
              <div className="absolute top-8 right-2 bg-card text-card-foreground border border-border rounded-md shadow-lg">
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="block px-4 py-2 text-sm text-destructive hover:bg-muted w-full text-left"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Load More Button */}
      {comments.length === amountOfComments &&
        amountOfComments < totalComments && (
          <button
            onClick={() => setAmountOfComments((prev) => prev + 5)}
            className="w-full bg-muted text-foreground py-2 px-4 rounded-md hover:bg-muted mt-4"
          >
            Load More
          </button>
        )}
    </div>
  );
}
