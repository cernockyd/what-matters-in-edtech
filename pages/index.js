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
import Image from 'next/image'
import Layout from '../components/Layout'
import React, { Fragment, useEffect, useState } from "react"
import useClipboard from "react-use-clipboard"

const SITE_URL = 'http://edtech-one.vercel.app'

const Heading = (props) => {
  // To add typescript typing visit https://stackoverflow.com/a/59685929
  const HeadingTag = `h${props.level}`;
  const [isCopied, setCopied] = useClipboard(SITE_URL+"#"+props.id, {
    successDuration: 1000
  })
  return (
    <HeadingTag id={props.id}>
      {props.children}
      <a 
        onClick={setCopied} 
        className={"copy-to-clipboard" + (isCopied ? " copied" : "")}
      >
      </a>
    </HeadingTag>
  )
}

const Citation = (props) => {
  return (
    <span className="text-gray-600">({props.author}, {props.year})</span>
  )
}

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

function getHeadings(items) {
  return items.reduce((acc, item) => {
    if (item.value) {
      // url has a # as first character, remove it to get the raw CSS-id
      acc[item.slug] = item.value;
    }
    if (item.children) {
      acc = {...acc, ...getHeadings(item.children)};
    }
    return acc;
  }, {});
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

function renderItems(items, activeId, depth) {
  if (depth >= 5)
    return null
  return (
    <ul className={"depth-"+depth}>
      {items.map((item) => {
        return (
          <li
            key={'#' + item.slug}
            className={activeId === item.slug ? "active" : ""}
          >
            <a
              href={'#' + item.slug}
            >
              {item.value}
            </a>
            {item.children && renderItems(item.children, activeId, depth+1)}
          </li>
        );
      })}
    </ul>
  );
}

function TableOfContents({activeId, items}) {
  //console.log(idList)
  return (
    renderItems(items, activeId, 1)
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
  Citation: Citation,
  h1: (props) => <Heading level="1" {...props} />,
  h2: (props) => <Heading level="2" {...props} />,
  h3: (props) => <Heading level="3" {...props} />,
  h4: (props) => <Heading level="4" {...props} />,
  h5: (props) => <Heading level="5" {...props} />,
  h6: (props) => <Heading level="6" {...props} />,
  Image: Image,
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
  const idList = getIds(toc);
  const headingsList = getHeadings(toc);
  const activeId = useActiveId(idList);
  return (
    <Fragment>
		<div className="main-container flex justify-center items-center flex-col">
        <h1 className="text-black text-6xl font-bold max-w-screen-md text-center">{frontMatter.title}</h1>
        {frontMatter.description && (
          <p className="text-xl text-black mt-4 pb-6 text-center">
            {frontMatter.description}
          </p>
        )}
    </div>
    <div className="nextra-container main-container flex flex-col">
    <div className="flex flex-1 h-full justify-end">
      <div>
        <article className="docs-container prose relative pb-16 px-6 md:px-8 w-full max-w-full overflow-x-hidden">
          <main className="max-w-screen-sm mx-auto">
            {content}
          </main>
        </article>
      </div>
      <aside style={{top: '0rem', height: '100vh'}} className="h-screen bg-white dark:bg-dark flex-shrink-0 w-full md:w-64 md:block fixed md:sticky z-10 hidden">
        <div className="sidebar border-gray-200 dark:border-gray-900 w-full p-4 pb-40 md:pb-16 h-full overflow-y-auto">
        <TableOfContents items={toc} activeId={activeId} />
        </div>
      </aside>
    </div>
    </div>
    </Fragment>
  )
}

export const getStaticProps = async ({ params }) => {
  const source = fs.readFileSync('content/index.mdx')
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
