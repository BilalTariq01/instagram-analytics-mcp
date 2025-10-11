import { AxiosError } from 'axios';

export interface FacebookConfig {
  accessToken?: string;
  pageId?: string;
  defaultApiVersion?: string;
  appAccessToken?: string;
}

export interface PagingCursors {
  before?: string;
  after?: string;
}

export interface PagingInfo {
  cursors?: PagingCursors;
  previous?: string;
  next?: string;
}

export interface InsightValue {
  value: unknown;
  end_time?: string;
}

export interface Insight {
  name: string;
  period?: string;
  values: InsightValue[];
  title?: string;
  description?: string;
  id: string;
}

export interface InsightsResponse {
  data: Insight[];
  paging?: PagingInfo;
}

export interface PageInsightsResult extends InsightsResponse {
  warnings?: string[];
}

export interface PostsWithInsightsResponse {
  data: Array<PostWithInsights>;
  paging?: PagingInfo;
}

export interface PostWithInsights {
  id: string;
  message?: string;
  created_time?: string;
  permalink_url?: string;
  insights?: InsightsResponse;
  [key: string]: unknown;
}

export interface NormalizedError {
  code: string;
  subcode?: string;
  message: string;
  raw?: unknown;
}

export interface GraphError {
  message: string;
  type?: string;
  code?: number;
  error_subcode?: number;
  fbtrace_id?: string;
}

export type GraphApiError = AxiosError<{
  error?: GraphError;
}>;

export interface PageInsightsParams {
  pageId?: string;
  metrics: string[];
  period?: string;
  since?: string;
  until?: string;
  limit?: number;
  after?: string;
  before?: string;
  apiVersion?: string;
  accessToken?: string;
}

export interface PostInsightsParams {
  postId: string;
  metrics: string[];
  period?: string;
  apiVersion?: string;
  accessToken?: string;
}

export interface ListPostsWithInsightsParams {
  pageId?: string;
  postMetrics: string[];
  limit?: number;
  after?: string;
  before?: string;
  apiVersion?: string;
  accessToken?: string;
}

export interface KnownMetric {
  name: string;
  periods: string[];
  notes?: string;
}

export interface KnownMetricsResponse {
  page: KnownMetric[];
  post: KnownMetric[];
}

export interface ValidateTokenParams {
  accessToken: string;
  apiVersion?: string;
  fields?: string[];
}

export interface ValidateTokenResult {
  isValid: boolean;
  id?: string;
  name?: string;
  raw: unknown;
}

export interface FacebookPage {
  id: string;
  name: string;
  access_token?: string;
  category?: string;
  tasks?: string[];
}

export interface ListPagesResponse {
  data: FacebookPage[];
  paging?: PagingInfo;
}

export class FacebookApiError extends Error {
  normalized: NormalizedError;

  constructor(normalized: NormalizedError) {
    super(normalized.message);
    this.normalized = normalized;
  }
}
