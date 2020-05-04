import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import PostItem from "../posts/PostItem";
import { addComment } from "../../actions/posts";

const CommentForm = ({ postId, addComment }) => {
  const [text, setText] = useState("");
  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Leave a comment</h3>
      </div>
      <form
        className="form my-1"
        onSubmit={(e) => {
          e.preventDefault();
          addComment(postId, { text });
          setText("");
        }}
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { addComment })(CommentForm);
