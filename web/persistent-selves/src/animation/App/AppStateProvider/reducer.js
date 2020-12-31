export default function reducer(state, { type, payload }) {
  switch (type) {
    case "SET_ANIMATION_STATE":
      return {
        ...state,
        animationState: payload,
      };

      case "SET_END_ANIMATION_STATE":
        return {
          ...state,
          endAnimationState: payload,
        };

    default:
      return state;
  }
}
