import React, { useState, useContext, useEffect } from "react";
import { useResource } from "react-request-hook";
import { StateContext } from "./contexts";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { state, dispatch } = useContext(StateContext);
  const { user } = state;

  const [postResponse, createPost] = useResource(({ title, content }) => ({
    url: "/post", // Update with your API endpoint for creating posts
    method: "post",
    headers: { Authorization: `${state.user.access_token}` },
    data: { title, content },
  }));

  function handleTitle(evt) {
    setTitle(evt.target.value);
  }

  function handleContent(evt) {
    setContent(evt.target.value);
  }

  function handleCreate() {
    const newPost = { title, content };
    createPost(newPost);
  }

  useEffect(() => {
    if (postResponse && postResponse.isLoading === false && postResponse.data) {
      const { title, content, id } = postResponse.data;
      dispatch({
        type: "CREATE_POST",
        title,
        content,
        id,
        author: user.username,
      });
    }
  }, [postResponse]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCreate();
      }}
    >
      <div>
        Author: <b>{user.username}</b>
      </div>
      <div>
        <label htmlFor="create-title">Title:</label>
        <input
          type="text"
          value={title}
          onChange={handleTitle}
          name="create-title"
          id="create-title"
        />
      </div>
      <textarea value={content} onChange={handleContent} />
      <input type="submit" value="Create" />
    </form>
  );
}
