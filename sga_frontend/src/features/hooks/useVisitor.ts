import {
  getVisitor,
  getVisitors,
  addVisitor,
  updateVisitor,
  deleteVisitor,
} from "../redux/thunks/visitorThunks";
import {
  clearVisitors,
  clearVisitor,
  clearResponse,
} from "../redux/slices/visitorSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { Visitor } from "../models/visitor";

export const useVisitor = () => {
  const dispatch = useAppDispatch();

  const visitors = useAppSelector((state) => state.visitor.visitors);
  const selectedVisitor = useAppSelector(
    (state) => state.visitor.selectedVisitor
  );
  const loading = useAppSelector((state) => state.visitor.loading);
  const response = useAppSelector((state) => state.visitor.response);
  const pagination = useAppSelector((state) => state.visitor.pagination);

  const fetchVisitors = (params: {
    search?: string;
    orderByName?: boolean;
    limit?: number;
    page?: number;
  }) => dispatch(getVisitors(params));
  const fetchVisitor = (id: string) => dispatch(getVisitor(id));
  const createVisitor = (data: Partial<Visitor>) => dispatch(addVisitor(data));
  const modifyVisitor = (data: Partial<Visitor>) =>
    dispatch(updateVisitor(data));
  const removeVisitor = ({ id }: { id: string }) => dispatch(deleteVisitor(id));

  const resetVisitors = () => dispatch(clearVisitors());
  const resetVisitor = () => dispatch(clearVisitor());
  const resetResponse = () => dispatch(clearResponse());

  return {
    visitors,
    selectedVisitor,
    loading,
    response,
    pagination,
    fetchVisitors,
    fetchVisitor,
    createVisitor,
    modifyVisitor,
    removeVisitor,
    resetVisitors,
    resetVisitor,
    resetResponse,
  };
};
