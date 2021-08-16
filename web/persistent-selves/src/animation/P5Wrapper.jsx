import React, { memo, useEffect, useRef } from "react";
import "react-p5";

import { generate } from "shortid";

export default function wrapper(id = generate()) {
  let canvas = null;

  function P5Wrapper({ sketch = () => {}, state = {}, dispatch = () => {} }) {
    const sketchContainer = useRef(null);

    useEffect(() => {
      canvas = new window.p5(sketch, sketchContainer.current);
      canvas.state = state;
      canvas.dispatch = dispatch;

      return () => {
        canvas.remove();
      };
    }, [dispatch, sketch, state]);

    return <div ref={sketchContainer} className="section"></div>;
  }

  P5Wrapper.defaultProps = {
    state: {},

    dispatch: () => {},
    sketch: () => {},
  };

  return memo(P5Wrapper, (_, nextProps) => {
    canvas.state = { ...nextProps.state };

    return true;
  });
}
