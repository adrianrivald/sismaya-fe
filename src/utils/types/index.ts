export * from './pagination';

export type MaybeRenderProp<P> = React.ReactNode | ((props: P) => React.ReactNode);
