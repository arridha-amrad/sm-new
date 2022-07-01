import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { getSocket } from "../../socket/mySocket";
import { removeComment, setComment, setLikeComment } from "../post/postSlice";
import {
  createCommentAPI,
  deleteCommentAPI,
  likeCommentAPI,
} from "./commentApi";
import { CreateCommentDTO, DeleteCommentDTO, LikeCommentDTO } from "./IComment";

export const likeCommentAction = createAsyncThunk(
  "comment/like",
  async (props: LikeCommentDTO, thunkAPI) => {
    const socket = getSocket();
    try {
      const { data } = await likeCommentAPI(props.comment._id);
      thunkAPI.dispatch(setLikeComment(props));
      if (data.notification) {
        socket?.emit("likeCommentCS", data.notification, props.toUsername);
      }
      return data.comment;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const createCommentAction = createAsyncThunk(
  "comment/create",
  async (dto: CreateCommentDTO, thunkAPI) => {
    const socket = getSocket();
    try {
      const { data } = await createCommentAPI(dto);
      thunkAPI.dispatch(setComment(data.comment));
      if (data.notification) {
        socket?.emit("createCommentCS", data.notification, dto.toUsername);
      }
      return data.comment;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const deleteCommentAction = createAsyncThunk(
  "comment/delete",
  async (dto: DeleteCommentDTO, thunkAPI) => {
    try {
      await deleteCommentAPI(dto.commentId);
      thunkAPI.dispatch(removeComment(dto));
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const commentSlice = createSlice({
  name: "comment",
  initialState: {},
  reducers: {},
});

// export const {} = commentSlice.actions;

export const selectCommentState = (state: RootState) => state.comment;

export default commentSlice.reducer;
