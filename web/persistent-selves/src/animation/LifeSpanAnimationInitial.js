import React, { useContext } from "react";
import { generate } from "shortid";
import initialSketch from "./initialSketch";
import { AppDispatchContext, AppStateContext } from "./App/AppStateProvider";
import p5Wrapper from "./P5Wrapper";

const P5Wrapper = p5Wrapper(generate());

export default function Initial() {
  const dispatch = useContext(AppDispatchContext);
  const { sketch1L, animationState } = useContext(AppStateContext);

  return (
    <div>
      {sketch1L && (
        <P5Wrapper
          dispatch={dispatch}
          sketch={initialSketch}
          state={{ animationState }}
        />
      )}
    </div>
  );
}
