import React, { useContext } from "react";
import { generate } from "shortid";
import finalSketch from "./finalSketch";
import { AppDispatchContext, AppStateContext } from "./App/AppStateProvider";
import p5Wrapper from "./P5Wrapper";

const P5Wrapper = p5Wrapper(generate());

export default function Final() {
  const dispatch = useContext(AppDispatchContext);
  const { sketch2L, endAnimationState } = useContext(AppStateContext);

  return (
    <div>
      {sketch2L && (
        <P5Wrapper
          dispatch={dispatch}
          sketch={finalSketch}
          state={{ endAnimationState }}
        />
      )}
    </div>
  );
}
