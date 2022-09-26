import { expect, test } from 'vitest'
import { getAdocFiles, getAdocPaths, getAdoc } from '../src/utils'
// import { Asciidoctor } from 'asciidoctor'

test('getAdocFiles', async () => {
    const files = await getAdocFiles('test/fixtures')
    expect(files).toMatchSnapshot()
})

test('getAdocPaths', async () => {
    const paths = await getAdocPaths('test/fixtures')
    expect(paths).toMatchSnapshot()
})

test('getAdocPaths with custom parameter name', async () => {
    const paths = await getAdocPaths('test/fixtures', 'custom')
    expect(Object.keys(paths[0].params)).toEqual(['custom'])
})

test('get existing asciidoctor document', () => {
    const adoc = getAdoc('test/fixtures/document.adoc')
    // expect(adoc).toBeInstanceOf(Asciidoctor.Document)
    expect(adoc.getTitle()).toEqual('Document Title')
})

test('get non-existing asciidoctor document', () => {
    expect(() => getAdoc('test/fixtures/non-existing.adoc')).toThrow()
})

test('get index asciidoctor document', () => {
    const direct = getAdoc('test/fixtures/documents/index.adoc')
    const indirect = getAdoc('test/fixtures/documents')
    expect(direct.getTitle()).toEqual(indirect.getTitle())
})