/**
 * Code generation and GitHub integration types
 */

export type FileAction = 'create' | 'update' | 'delete'

export interface GeneratedFile {
  path: string
  action: FileAction
  content?: string
  previousContent?: string
}

export interface CodeGenerationResult {
  files: GeneratedFile[]
  commitMessage: string
  description?: string
}

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
    avatar_url: string
  }
  description: string | null
  url: string
  html_url: string
  private: boolean
  default_branch: string
}

export interface GitHubBranch {
  name: string
  commit: {
    sha: string
    url: string
  }
  protected: boolean
}

export interface PushToGitHubPayload {
  files: GeneratedFile[]
  commitMessage: string
  repository: string
  branch: string
}

export interface PushToGitHubResponse {
  success: boolean
  commit?: {
    sha: string
    message: string
    url: string
  }
  repository?: {
    name: string
    full_name: string
    owner: string
    html_url: string
  }
  branch?: string
  error?: string
}
