/**
 * Code generation utilities
 */

import type { CodeGenerationResult, GeneratedFile, FileAction } from '../types/codeGeneration'

/**
 * Validates and parses code generation result from AI
 */
export function parseCodeGenerationResult(content: string): CodeGenerationResult | null {
  try {
    // Try to extract JSON from content (in case AI wraps it in markdown code blocks)
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    const jsonStr = jsonMatch ? jsonMatch[1] : content

    const result = JSON.parse(jsonStr)

    // Validate structure
    if (!Array.isArray(result.files) || !result.commitMessage) {
      return null
    }

    // Validate each file
    const validFiles = result.files.filter((file: any) => {
      const action: FileAction = file.action
      if (!['create', 'update', 'delete'].includes(action)) {
        return false
      }

      if (!file.path || typeof file.path !== 'string') {
        return false
      }

      // Validate path (prevent traversal)
      if (file.path.includes('..') || file.path.startsWith('/')) {
        return false
      }

      // Content required for create/update
      if ((action === 'create' || action === 'update') && !file.content) {
        return false
      }

      return true
    })

    if (validFiles.length !== result.files.length) {
      return null
    }

    return {
      files: validFiles,
      commitMessage: String(result.commitMessage).substring(0, 100),
      description: result.description ? String(result.description).substring(0, 500) : undefined
    }
  } catch {
    return null
  }
}

/**
 * Detects if AI response contains code generation
 */
export function isCodeGenerationResponse(content: string): boolean {
  try {
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    const jsonStr = jsonMatch ? jsonMatch[1] : content
    const obj = JSON.parse(jsonStr)

    return (
      obj.files &&
      Array.isArray(obj.files) &&
      obj.files.length > 0 &&
      obj.commitMessage &&
      typeof obj.commitMessage === 'string'
    )
  } catch {
    return false
  }
}

/**
 * Validates file path for security
 */
export function validateFilePath(path: string): boolean {
  // Prevent path traversal
  if (path.includes('..') || path.startsWith('/')) {
    return false
  }

  // Prevent absolute paths
  if (path.match(/^[a-zA-Z]:[\/\\]/)) {
    return false
  }

  // Path should be reasonable length
  if (path.length > 500) {
    return false
  }

  // Must contain at least a filename
  if (!path.includes('.')) {
    return false
  }

  return true
}

/**
 * Validates commit message
 */
export function validateCommitMessage(message: string): boolean {
  if (!message || message.length === 0) {
    return false
  }

  if (message.length > 100) {
    return false
  }

  return true
}

/**
 * Gets file extension and language for syntax highlighting
 */
export function getFileLanguage(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || ''

  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    rs: 'rust',
    go: 'go',
    rb: 'ruby',
    php: 'php',
    html: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    sql: 'sql',
    sh: 'bash',
    bash: 'bash',
    md: 'markdown',
    vue: 'vue',
    svelte: 'svelte',
    jsx: 'jsx'
  }

  return languageMap[ext] || 'plaintext'
}
