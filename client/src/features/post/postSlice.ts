import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { User } from "../authentication/IAuthentication";
import { Post, PostState, UpdatePostDTO } from "./IPost";
import {
  createPostAPI,
  deletePostAPI,
  getPostsAPI,
  likePostAPI,
  updatePostAPI,
} from "./postApi";
import {
  IComment,
  DeleteCommentDTO,
  LikeComment,
  UnsetReplyCommentForm,
} from "../comment/IComment";
import { WritableDraft } from "immer/dist/internal";
import {
  createReplyAPI,
  deleteReplyAPI,
} from "../replyComment/replyCommentApi";
import {
  LikeReplyDTO,
  ReplyComment,
  ReplyCommentDTO,
  ReplyCommentResult,
} from "../replyComment/IReply";
import { likeReplyAPI } from "../replyComment/replyApi";
import { getSocket } from "../../mySocket";

const initialState: PostState = {
  isLoading: false,
  isFetchingPosts: true,
  post: null,
  posts: [],
};

export const likeReplyAction = createAsyncThunk(
  "reply/likeReply",
  async (replyId: string, thunkAPI) => {
    try {
      await likeReplyAPI(replyId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const updatePostAction = createAsyncThunk(
  "post/update",
  async (dto: UpdatePostDTO, thunkAPI) => {
    try {
      const { data } = await updatePostAPI(dto);
      return data.post;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const createPostAction = createAsyncThunk(
  "post/createPost",
  async (formData: FormData, thunkAPI) => {
    try {
      const { data } = await createPostAPI(formData);
      return data.post;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getPostsAction = createAsyncThunk(
  "post/getPosts",
  async (_, thunkAPI) => {
    try {
      const { data } = await getPostsAPI();
      return data.posts;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const likePostAction = createAsyncThunk(
  "post/likePost",
  async (postId: string, thunkAPI) => {
    const socket = getSocket();
    try {
      const { data } = await likePostAPI(postId);
      if (data.notification) {
        socket?.emit("likePostCS", data.notification, data.post.owner.username);
      }
      return data.post;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const replyComment = createAsyncThunk(
  "post/replyComment",
  async (body: ReplyCommentDTO, thunkAPI) => {
    try {
      const { data } = await createReplyAPI(
        body.body,
        body.receiver,
        body.commentId
      );
      return data.reply;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const deleteReplyAction = createAsyncThunk(
  "post/deleteReply",
  async (replyId: string, thunkAPI) => {
    try {
      await deleteReplyAPI(replyId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const deletePostAction = createAsyncThunk(
  "post/deletePost",
  async (post: Post, thunkAPI) => {
    try {
      await deletePostAPI(post._id);
      return post;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

interface LikePost {
  postIndex: number;
  user: User;
  isLiked: boolean;
}
export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setLikeReply: (state, action: PayloadAction<LikeReplyDTO>) => {
      const { commentIndex, postIndex, replyIndex, isLiked, loginUser } =
        action.payload;
      let relatedLikes =
        state.posts[postIndex].comments[commentIndex].replies[replyIndex].likes;
      if (isLiked) {
        relatedLikes = relatedLikes.filter(
          (user) => user._id !== loginUser._id
        );
        state.posts[postIndex].comments[commentIndex].replies[
          replyIndex
        ].likes = relatedLikes;
      } else {
        relatedLikes.push(loginUser);
      }
    },
    setPosts: (state, action: PayloadAction<Post[]>) => {
      const posts = action.payload as WritableDraft<Post[]>;
      state.posts = posts;
    },
    deleteReplyComment: (state, action: PayloadAction<ReplyCommentResult>) => {
      const { commentIndex, postIndex, reply } = action.payload;
      const comment = state.posts[postIndex].comments[commentIndex];
      comment.replies = comment.replies.filter(
        (rply) => rply._id !== reply._id
      );
    },
    replyCommentResult: (state, action: PayloadAction<ReplyCommentResult>) => {
      const { commentIndex, postIndex, reply } = action.payload;
      state.posts[postIndex].comments[commentIndex].replies.push(
        reply as WritableDraft<ReplyComment>
      );
    },
    setShowReplyCommentInput: (state, action: PayloadAction<IComment>) => {
      const comment = action.payload;
      const indexPost = state.posts.findIndex(
        (post) => post._id === comment.post
      );
      state.posts[indexPost].comments = state.posts[indexPost].comments.map(
        (cmt) => ({
          ...cmt,
          isShowInput: cmt._id === comment._id,
        })
      );
    },
    unsetReplyCommentForm: (
      state,
      action: PayloadAction<UnsetReplyCommentForm>
    ) => {
      const { comment, commentIndex } = action.payload;
      const indexPost = state.posts.findIndex(
        (post) => post._id === comment.post
      );
      state.posts[indexPost].comments[commentIndex].isShowInput = false;
    },
    toggleIsEdit: (state, action: PayloadAction<number>) => {
      state.posts[action.payload].isEdit = !state.posts[action.payload].isEdit;
    },
    unsetIsEdit: (state, action: PayloadAction<number>) => {
      state.posts[action.payload].isEdit = false;
    },
    setLikePost: (state, action: PayloadAction<LikePost>) => {
      const { postIndex, user, isLiked } = action.payload;
      if (isLiked) {
        state.posts[postIndex].likes = state.posts[postIndex].likes.filter(
          (like) => like._id !== user._id
        );
      } else {
        state.posts[postIndex].likes.push(user);
      }
    },
    setLikeComment: (state, action: PayloadAction<LikeComment>) => {
      const { comment, isLiked, user } = action.payload;
      for (let i = 0; i < state.posts.length; i++) {
        if (state.posts[i]._id === comment.post) {
          state.posts[i].comments.find(
            (cmt) =>
              cmt._id === comment._id &&
              (isLiked
                ? (cmt.likes = cmt.likes.filter((usr) => usr._id !== user._id))
                : cmt.likes.push(user))
          );
          break;
        }
      }
    },
    setComment: (state, action) => {
      const comment = action.payload;
      const post = state.posts.find((post) => post._id === comment.post);
      if (post) {
        post.comments.splice(0, 0, comment);
      }
    },
    removeComment: (state, action: PayloadAction<DeleteCommentDTO>) => {
      const { commentId, postId } = action.payload;
      const post = state.posts.find((post) => post._id === postId);
      if (post) {
        post.comments = post.comments.filter(
          (comment) => comment._id !== commentId
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deletePostAction.fulfilled, (state, action) => {
      state.posts = state.posts.filter((p) => p._id !== action.payload._id);
    });
    builder.addCase(updatePostAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updatePostAction.fulfilled, (state, action) => {
      state.isLoading = false;
      const post = action.payload;
      for (let i = 0; i < state.posts.length; i++) {
        if (state.posts[i]._id === post._id) {
          state.posts[i].body = post.body;
          break;
        }
        continue;
      }
    });
    builder.addCase(getPostsAction.fulfilled, (state, action) => {
      const posts = action.payload as WritableDraft<Post[]>;
      state.isFetchingPosts = false;
      state.posts = posts;
    });
    builder.addCase(getPostsAction.rejected, (state) => {
      state.isFetchingPosts = false;
    });
    builder.addCase(createPostAction.fulfilled, (state, action) => {
      const newPost = action.payload as WritableDraft<Post>;
      state.isLoading = false;
      state.posts.unshift(newPost);
    });
  },
});

export const {
  setLikeReply,
  deleteReplyComment,
  replyCommentResult,
  setLikePost,
  setComment,
  removeComment,
  toggleIsEdit,
  unsetIsEdit,
  setLikeComment,
  setShowReplyCommentInput,
  unsetReplyCommentForm,
  setPosts,
} = postSlice.actions;

export const selectPostState = (state: RootState) => state.post;

export default postSlice.reducer;
