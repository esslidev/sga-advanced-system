import {
  //getVisit,
  getVisits,
  addVisit,
  updateVisit,
  deleteVisit,
} from "../redux/thunks/visitThunks";
import {
  clearVisits,
  clearVisit,
  clearResponse,
} from "../redux/slices/visitSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { Visit } from "../models/visit";

export const useVisit = () => {
  const dispatch = useAppDispatch();

  const visits = useAppSelector((state) => state.visit.visits);
  const selectedVisit = useAppSelector((state) => state.visit.selectedVisit);
  const loading = useAppSelector((state) => state.visit.loading);
  const response = useAppSelector((state) => state.visit.response);
  const pagination = useAppSelector((state) => state.visitor.pagination);

  const fetchVisits = (params: {
    visitorId: string;
    limit?: number;
    page?: number;
  }) => dispatch(getVisits(params));
  //const fetchVisit = (id: string) => dispatch(getVisit(id));
  const createVisit = (data: Partial<Visit>) => dispatch(addVisit(data));
  const modifyVisit = (data: Partial<Visit>) => dispatch(updateVisit(data));
  const removeVisit = ({ id }: { id: string }) => dispatch(deleteVisit(id));

  const resetVisits = () => dispatch(clearVisits());
  const resetVisit = () => dispatch(clearVisit());
  const resetResponse = () => dispatch(clearResponse());

  return {
    visits,
    selectedVisit,
    loading,
    response,
    pagination,
    fetchVisits,
    //fetchVisit,
    createVisit,
    modifyVisit,
    removeVisit,
    resetVisits,
    resetVisit,
    resetResponse,
  };
};
