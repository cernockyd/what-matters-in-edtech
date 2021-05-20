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
import * as matter from 'gray-matter'

const SITE_URL = 'http://edtech-one.vercel.app'

const Heading = (props) => {
  // To add typescript typing visit https://stackoverflow.com/a/59685929
  const HeadingTag = `h${props.level}`;
  return (
    <HeadingTag className="heading-tag" id={props.id}>
      <Link href={"#"+props.id} passHref>
        <a className="heading-link">
          {props.children}
        </a>
      </Link>
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

function useActiveId(itemIds, activeId, setActiveId) {
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
  return activeId;
}

function renderItems(items, activeId, setActiveId, depth) {
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
              onClick={() => setActiveId('#'+item.slug)}
            >
              {item.value}
            </a>
            {item.children && renderItems(item.children, activeId, setActiveId, depth+1)}
          </li>
        );
      })}
    </ul>
  );
}

function TableOfContents({activeId, items, setActiveId}) {
  //console.log(idList)
  return (
    renderItems(items, activeId, setActiveId, 1)
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
  const itemIds = getIds(toc);
  const headingsList = getHeadings(toc);
  const [activeId, setActiveId] = useState(``);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -100% 0%` }
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

  return (
    <Fragment>
		<div className="main-container justify-center items-center flex">
			<div className="max-w-screen-lg mx-auto">
				<h1 className="text-brand text-lg mb-0 mt-0 font-bold text-center tracking-tight">{frontMatter.title}</h1>
        {frontMatter.description && (
          <p className="text-6xl text-black text-center mt-0 font-bold pb-0 mb-6 text-center">
            {frontMatter.description}
          </p>
        )}
				<div className="text-center text-gray-600 mt-7 mb-7">
					{frontMatter?.date}
				</div>
				<div className="mt-2 mb-8 flex justify-center">
					<div className="flex items-center mr-2">
						<Image src="/cernocky.png" className="border box-border border-gray-300 rounded-full" height={32} width={32} />
						<div className="ml-2">
							<div className="font-semibold text-sm text-black">
								Dalibor Černocký 
							</div>
							<div className="mt-0 text-sm">
								<Link href="https://twitter.com/cernockyd" passHref>
									<a className="text-brand">@cernockyd</a>
								</Link>
							</div>
						</div>
					</div>
					<div className="flex items-center ml-4">
						<Image src="/eduinteres.jpg" className="border border-gray-300 rounded-full" height={32} width={32} />
						<div className="ml-2">
							<div className="font-semibold text-sm text-black">
							  Michal Černý 
							</div>
							<div className="mt-0 text-sm text-black">
								<Link href="https://twitter.com/eduinteres" passHref>
									<a className="text-brand">@eduinteres</a>
								</Link>{' '}
                (supervisor)   
							</div>
						</div>
					</div>
					<div className="flex items-center ml-4">
						<Image src="/muni.png" className="border border-gray-300 rounded-full" height={32} width={32} />
						<div className="ml-2">
							<div className="font-semibold text-black text-sm">
							  KISK, Faculty of Arts 
							</div>
							<div className="mt-0 text-sm text-black">
                Masaryk University
							</div>
						</div>
					</div>
				</div>
        {frontMatter.abstract && (
          <p className="text-black max-w-screen-md mx-auto pb-2 text-lg">
            {frontMatter.abstract}
          </p>
        )}
			</div>
    </div>
    <div className="nextra-container main-container flex flex-col">
    <div className="flex flex-1 h-full justify-end">
      <div>
        <article className="docs-container prose relative pb-6 px-6 md:px-8 w-full max-w-full overflow-x-hidden">
          <main className="max-w-screen-sm mx-auto">
            {content}
          </main>
        </article>
      </div>
      <aside style={{top: '0rem', height: '100vh'}} className="h-screen bg-white dark:bg-dark flex-shrink-0 w-full md:w-64 md:block fixed md:sticky z-10 hidden">
        <div className="sidebar border-gray-200 flex flex-col justify-between dark:border-gray-900 w-full p-4 pb-6 pt-6 md:pb-6 h-full overflow-y-auto">
          <TableOfContents items={toc} activeId={activeId} setActiveId={setActiveId} />
          <div>
            <a 
               href={"https://mobile.twitter.com/search?q="+SITE_URL}
               target="_blank" 
               rel="noopener noreferrer"
               className="transition w-48 duration-200 ease-in-out transform text-gray-700 text-sm bg-transparent border border-gray-300 pl-4 pr-5 py-2 inline-block rounded hover:border-black hover:text-black hover:border-black"
            >
              <svg className="inline mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M1.5 2.75a.25.25 0 01.25-.25h8.5a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-3.5a.75.75 0 00-.53.22L3.5 11.44V9.25a.75.75 0 00-.75-.75h-1a.25.25 0 01-.25-.25v-5.5zM1.75 1A1.75 1.75 0 000 2.75v5.5C0 9.216.784 10 1.75 10H2v1.543a1.457 1.457 0 002.487 1.03L7.061 10h3.189A1.75 1.75 0 0012 8.25v-5.5A1.75 1.75 0 0010.25 1h-8.5zM14.5 4.75a.25.25 0 00-.25-.25h-.5a.75.75 0 110-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0114.25 12H14v1.543a1.457 1.457 0 01-2.487 1.03L9.22 12.28a.75.75 0 111.06-1.06l2.22 2.22v-2.19a.75.75 0 01.75-.75h1a.25.25 0 00.25-.25v-5.5z"></path></svg>
              Discuss on Twitter 
            </a>
          </div>
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
