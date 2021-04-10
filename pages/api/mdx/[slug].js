import fs from 'fs'
import path from 'path'
import { POSTS_PATH } from '../../../utils/mdxUtils'

export default function handler(req, res) {
    const { slug } = req.query
    const postFilePath = path.join(POSTS_PATH, slug + '.mdx')
    const source = fs.readFileSync(postFilePath)
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end(source)
  }
