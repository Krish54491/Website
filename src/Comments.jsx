import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_ROUTES } from "./utils/apiRoutes";
import ReactModal from "react-modal";

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
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [commentsFetch, setCommentsFetch] = useState(false);
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
  }, [page, commentsFetch, amountOfComments]);
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

  async function handleChangeUsername(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_ROUTES.CHANGE_USERNAME}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newUsername }),
      });
      const data = await response.json();
      if (data.success) {
        //alert("Username updated successfully!");
        setIsUsernameModalOpen(false);
        setNewUsername("");
        setCommentsFetch(!commentsFetch);
      } else {
        alert("Failed to update username: " + data.message);
        if (data.message === "Invalid auth cookie") {
          localStorage.setItem("loggedIn", "false");
          setLoggedIn(false);
        }
      }
    } catch (error) {
      localStorage.setItem("loggedIn", "false");
      console.error("Error updating username:", error);
      alert("An error occurred while updating the username.");
    }
  }
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Comments
        </h2>

        {loggedIn ? (
          <button
            onClick={() => navigate("/account")}
            className="bg-cyan-500 py-2 px-4 rounded-md shadow-lg hover:bg-cyan-600 dark:bg-blue-800 dark:hover:bg-blue-700 hover:text-white dark:hover:text-black"
          >
            Account
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-cyan-500 py-2 px-4 rounded-md shadow-lg hover:bg-cyan-600 dark:bg-blue-800 dark:hover:bg-blue-700 hover:text-white dark:hover:text-black"
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
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-inherit"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-500 py-2 px-4 rounded-md hover:bg-cyan-600 dark:bg-blue-800 dark:hover:bg-blue-700 hover:text-white dark:hover:text-black "
        >
          Add Comment
        </button>
      </form>
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm relative"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-gray-100">
                {comment.username}
              </strong>{" "}
              - {new Date(comment.created_at).toLocaleString()}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {comment.content}
            </p>
            <button
              onClick={() =>
                setMenuOpen((prev) => (prev === comment.id ? null : comment.id))
              }
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              &#x22EE;
            </button>
            {menuOpen === comment.id && (
              <div className="absolute top-8 right-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
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
            className="w-full bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 mt-4"
          >
            Load More
          </button>
        )}

      <ReactModal
        isOpen={isUsernameModalOpen}
        onRequestClose={() => setIsUsernameModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Change Username
          </h2>
          <form onSubmit={handleChangeUsername}>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-inherit mb-4"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsUsernameModalOpen(false)}
                className="mr-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-cyan-500 py-2 px-4 rounded-md hover:bg-cyan-600 dark:bg-blue-800 dark:hover:bg-blue-700 hover:text-white dark:hover:text-black "
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </ReactModal>
    </div>
  );
}
