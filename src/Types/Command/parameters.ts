type CommandParameters = { [key: string]: any };

type MappedParameters<T> = {
  [P in keyof T]: T[P] extends new (...args: any[]) => any
    ? InstanceType<T[P]>
    : T[P];
};

export { CommandParameters, MappedParameters };
