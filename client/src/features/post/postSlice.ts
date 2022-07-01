import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { User } from "../authentication/IAuthentication";
import { Post, PostState, UpdatePostDTO } from "./IPost";
import {
  createPostAPI,
  deletePostAPI,
  likePostAPI,
  updatePostAPI,
} from "./postApi";
import { DeleteCommentDTO, LikeCommentDTO } from "../comment/IComment";
import { WritableDraft } from "immer/dist/internal";
import {
  createReplyAPI,
  deleteReplyAPI,
} from "../replyComment/replyCommentApi";
import {
  DeleteReplyDTO,
  LikeReplyDTO,
  ReplyCommentDTO,
} from "../replyComment/IReply";
import { likeReplyAPI } from "../replyComment/replyApi";
import { getSocket } from "../../socket/mySocket";

const initialState: PostState = {
  isLoading: false,
  isFetchingPosts: true,
  post: null,
  posts: [],
};

export const likeReplyAction = createAsyncThunk(
  "reply/likeReply",
  async (dto: LikeReplyDTO, thunkAPI) => {
    const socket = getSocket();
    try {
      const { data } = await likeReplyAPI(dto.replyId);
      thunkAPI.dispatch(setLikeReply(dto));
      if (data.notification) {
        socket?.emit("likeReplyCS", data.notification, dto.toUsername);
      }
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

export const replyCommentAction = createAsyncThunk(
  "post/replyComment",
  async (dto: ReplyCommentDTO, thunkAPI) => {
    const socket = getSocket();
    try {
      const { data } = await createReplyAPI(
        dto.body,
        dto.receiverId,
        dto.commentId,
        dto.isReplyToReply!,
        dto.answeredReplyId!
      );
      if (data.notification) {
        socket?.emit("createReplyCS", data.notification, dto.toUsername);
      }
      return {
        reply: data.reply,
        commentIndex: dto.commentIndex,
        postIndex: dto.postIndex,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const deleteReplyAction = createAsyncThunk(
  "post/deleteReply",
  async (dto: DeleteReplyDTO, thunkAPI) => {
    try {
      await deleteReplyAPI(dto.replyId);
      return dto;
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
      state.isFetchingPosts = false;
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
    setLikeComment: (state, action: PayloadAction<LikeCommentDTO>) => {
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
    // Reply Action
    builder.addCase(deleteReplyAction.fulfilled, (state, action) => {
      const { commentIndex, postIndex, replyId } = action.payload;
      const comment = state.posts[postIndex].comments[commentIndex];
      comment.replies = comment.replies.filter((rply) => rply._id !== replyId);
    });
    builder.addCase(replyCommentAction.fulfilled, (state, action) => {
      const { reply, commentIndex, postIndex } = action.payload;
      state.posts[postIndex].comments[commentIndex].replies.push(reply);
    });
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
    builder.addCase(createPostAction.fulfilled, (state, action) => {
      const newPost = action.payload as WritableDraft<Post>;
      state.isLoading = false;
      state.posts.unshift(newPost);
    });
  },
});

export const {
  setLikeReply,
  setLikePost,
  setComment,
  removeComment,
  toggleIsEdit,
  unsetIsEdit,
  setLikeComment,
  setPosts,
} = postSlice.actions;

export const selectPostState = (state: RootState) => state.post;

export default postSlice.reducer;
