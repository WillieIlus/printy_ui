import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const appDir = resolve(__dirname, '../../app')
const read = (rel: string) => readFileSync(resolve(appDir, rel), 'utf8')

describe('workspace job-code search', () => {
  it('mounts the shared search in the desktop and mobile workspace chrome', () => {
    const shell = read('components/design/layout/WorkspaceShell.vue')
    expect(shell).toContain('<DesignJobCodeSearch')
    expect(shell.match(/<DesignJobCodeSearch/g)?.length).toBe(2)
  })

  it('looks up the role-scoped job list and routes to the canonical detail', () => {
    const search = read('components/design/layout/JobCodeSearch.vue')
    expect(search).toContain('API.managedJobs.list')
    expect(search).toContain('/app/manager/jobs/${id}')
    expect(search).toContain('/app/printer/jobs/${id}')
    expect(search).toContain('/app/buyer/jobs/${id}')
    expect(search).toContain('That job is not in your workspace.')
  })
})
