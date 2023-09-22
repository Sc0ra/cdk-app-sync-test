export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDate: string;
  AWSDateTime: string;
  AWSEmail: string;
  AWSIPAddress: string;
  AWSJSON: string;
  AWSPhone: string;
  AWSTime: string;
  AWSTimestamp: number;
  AWSURL: string;
};

export type DemoInput = {
  version: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createDemo?: Maybe<Demo>;
};

export type MutationCreateDemoArgs = {
  input: DemoInput;
};

export type Query = {
  __typename?: 'Query';
  getDemo?: Maybe<Demo>;
  getDemos?: Maybe<Array<Demo>>;
};

export type QueryGetDemoArgs = {
  id: Scalars['String'];
};

export type Demo = {
  __typename?: 'demo';
  id: Scalars['String'];
  version: Scalars['String'];
};
