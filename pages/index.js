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
import CustomLink from '../components/CustomLink'
import fs from 'fs'
import Layout from '../components/Layout'
import React, { useEffect, useState } from "react";

function getIds(items) {
  return items.reduce((acc, item) => {
    if (item.slug) {
      // url has a # as first character, remove it to get the raw CSS-id
      acc.push(item.slug);
    }
    if (item.children) {
      acc.push(...getIds(item.children));
    }
    return acc;
  }, []);
}

function useActiveId(itemIds) {
  const [activeId, setActiveId] = useState(`test`);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );
    itemIds.forEach((id) => {
      observer.observe(document.getElementById(id));
    });
    return () => {
      itemIds.forEach((id) => {
        observer.unobserve(document.getElementById(id));
      });
    };
  }, [itemIds]);
  console.log(activeId)
  return activeId;
}

function renderItems(items, activeId) {
  return (
    <ul>
      {items.map((item) => {
        return (
          <li
            key={'#' + item.slug}
            className={(
              activeId === item.slug ? "active" : ""
            )}
          >
            <a
              href={'#' + item.slug}
            >
              {item.value}
            </a>
            {item.children && renderItems(item.children, activeId)}
          </li>
        );
      })}
    </ul>
  );
}

function TableOfContents(props) {
  const idList = getIds(props.items);
  console.log(idList)
  const activeId = useActiveId(idList);
  return (
    renderItems(props.items, activeId)
  );
}

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
  a: CustomLink,
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
				eachRecursive(item.children);			
			item.slug = slugify(item.value, { lower: true, strict: true })
		}
	)
	return sum
}

export default function PostPage({ source, frontMatter, toc }) {
  const content = hydrate(source, { components })
  const router = useRouter()
	let sections = [] 
  return (
		<div className="nextra-container main-container flex flex-col">
    <div className="flex flex-1 h-full">
      <article className="docs-container relative pt-20 pb-16 px-6 md:px-8 w-full max-w-full overflow-x-hidden">
        <main className="max-w-screen-md mx-auto">
					<div className="mb-20">
            <h1 className="text-3xl font-bold text-red-600 mt-0">{frontMatter.title}</h1>
							{frontMatter.description && (
								<p className="text-5xl font-extrabold text-black mt-0 pb-1">
									{frontMatter.description}
								</p>
							)}
							{frontMatter.abstract && (
								<p className="text-gray-900 pb-0">
									{frontMatter.abstract}
								</p>
							)}
						</div>
          {content}
        </main>
      </article>
      <aside style={{top: '0rem', height: '100vh'}} className="h-screen bg-white dark:bg-dark flex-shrink-0 w-full md:w-64 md:block fixed md:sticky z-10 hidden">
        <div className="sidebar border-gray-200 dark:border-gray-900 w-full p-4 pb-40 md:pb-16 h-full overflow-y-auto">
          <div>
						<Link href="/" passHref>
							<a className="sidebar-title">{frontMatter.title}</a>
						</Link>
          </div>
          <TableOfContents items={toc} />
        </div>
      </aside>
    </div>
    </div>
  )
}

export const getStaticProps = async ({ params }) => {
  const source = fs.readFileSync('posts/example-post.mdx')
  const { content, data } = matter(source)
  let processor = unified()
    .use(markdown, { commonmark: true })
    .use(toc)
  let node = processor.parse(content)
  let tree = processor.runSync(node)
  //console.log(tree)
  eachRecursive(tree)
  const mdxSource = await renderToString(content, {
    components,
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [
        require('remark-slug'),
        //require('remark-autolink-headings'),
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
