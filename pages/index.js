import fs from 'fs' 
import Scrollspy from 'react-scrollspy'
import matter from 'gray-matter'
import unified from 'unified'
import markdown from 'remark-parse'
import toc from 'remark-extract-toc'
import hydrate from 'next-mdx-remote/hydrate'
import renderToString from 'next-mdx-remote/render-to-string'
import dynamic from 'next/dynamic'
import slugify from 'slugify'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import path from 'path'
import CustomLink from '../components/CustomLink'
import Layout from '../components/Layout'
import { postFilePaths, POSTS_PATH } from '../utils/mdxUtils'

let si = 0

const CustomSection = ({ children, ...otherProps }) => {
	si += 1
	return (
		<section id={"section-"+si}>{children}</section>
	)	
}

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
  a: CustomLink,
	section: CustomSection,
  // It also works with dynamically-imported components, which is especially
  // useful for conditionally loading components for certain routes.
  // See the notes in README.md for more details.
  TestComponent: dynamic(() => import('../components/TestComponent')),
  Head,
}

function eachRecursive(list)
{
	let sum = 0
	list.forEach(item => 
		{
			if (item.children.length)
				sum += 1 + eachRecursive(item.children);
			else
				sum += 1
			
			item.section = sum
		}
	)
	return sum
}

export default function PostPage({ source, frontMatter, toc }) {
  const content = hydrate(source, { components })
  const router = useRouter()
	let sections = []
  eachRecursive(toc) 
  return (
		<div className="nextra-container main-container flex flex-col">
    <div className="flex flex-1 h-full">
      <article className="docs-container relative pt-20 pb-16 px-6 md:px-8 w-full max-w-full overflow-x-hidden">
        <main className="max-w-screen-md mx-auto">
					<div className="mb-20">
            <h1 className="text-mb-0 font-semibold text-mahogany-500 text-4xl">{frontMatter.title}</h1>
							{frontMatter.description && (
								<p className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-mahogany-300 to-mahogany-400 mt-0 pb-1">
									{frontMatter.description}
								</p>
							)}
							<p className="text-mahogany-500 mt-0 pb-0">
								By Dalibor Cernocky, KISK FF MUNI	
							</p>
							{frontMatter.abstract && (
								<p className="text-mahogany-500 mt-0 pb-0">
									{frontMatter.abstract}
								</p>
							)}
						</div>
          {content}
        </main>
      </article>
      <aside style={{top: '0rem', height: '100vh'}} className="h-screen bg-white dark:bg-dark flex-shrink-0 w-full md:w-64 md:block fixed md:sticky z-10 hidden">
        <div className="sidebar border-gray-200 dark:border-gray-900 w-full p-4 pb-40 md:pb-16 h-full overflow-y-auto">
          <div className="text-lg mb-4 text-mahogany-500 font-bold">
						<Link href="/" passHref>
							<a>{frontMatter.title}</a>
						</Link>
          </div>
          <Scrollspy items={sections} currentClassName="active"> 
            {toc.map((item, i) => <li key={i}>
              <Link passHref href={router.pathname+"#"+slugify(item.value, { lower: true, strict: true })}><a>{item.value}</a></Link>
							<ul>
							{item.children.map((child, e) => (
								<li key={e}>
									<Link href={router.pathname+"#"+slugify(child.value, { lower: true, strict: true })}><a>{child.value}</a></Link>
									<ul>
									{child.children.map((subchild, k) => (
										<li key={k}>
											<Link href={router.pathname+"#"+slugify(subchild.value, { lower: true, strict: true })}><a>{subchild.value}</a></Link>
										</li>
									))}	
									</ul>
								</li>
							))}	
							</ul>
            </li>)}
          </Scrollspy>
        </div>
      </aside>
    </div>
    </div>
  )
}

function list_to_tree(list) {
  var map = {}, node, roots = [], i;
  
	const headingText = list[i][2].trim()
	const level = list[i][1].trim() === '##' ? 1 : 2 
	const headingLink = slugify(headingText, { lower: true, strict: true })
	
  for (i = 0; i < list.length; i += 1) {
    map[headingLink] = i; // initialize the map
    list[i].children = []; // initialize the children
  }
  
  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parentId !== "0") {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parentId]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  //console.log(roots)
  return roots;
}

export const getStaticProps = async ({ params }) => {
  const postFilePath = path.join(POSTS_PATH, `example-post.mdx`)
  const source = fs.readFileSync(postFilePath)
  const { content, data } = matter(source)
  let processor = unified()
    .use(markdown, { commonmark: true })
    .use(toc)
  let node = processor.parse(content)
  let tree = processor.runSync(node)
  console.log(tree)
  const mdxSource = await renderToString(content, {
    components,
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [
        require('remark-slug'),
        require('remark-sectionize'),
      ],
      rehypePlugins: [],
    },
    scope: data,
  })

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
			toc: tree,
    },
  }
}

export const getStaticPaths = async () => {
  const paths = postFilePaths
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}
