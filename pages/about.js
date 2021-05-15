import Link from 'next/link'

const Page = () => (
    <div className="flex flex-col px-3">
      <nav className="my-4 hidden bg-white dark:bg-dark dark:border-gray-900"> 
        <Link href={"/"} passHref>
          <a className="text-base text-black">← Go to homepage</a>
        </Link>          
      </nav>
      <article className="prose mx-auto mt-10 mb-16" style={{maxWidth: 640}}>
        <h1>Towards open research</h1>
        <h2>The rise of independent researchers</h2>
        <p>
          As a person from the open source community, which is able to develop various flagship projects with the support of the community, I don't understand the publishing model held by monopols in the research sphere.
        </p>
        <p>
          There seems to be a lot of inefficiency driven by such model and I know, that in the long term, efficiency is something you cant forego. 
        </p>
        <p>
          Recently, I have noticed that there are cases of researchers who took the bet and try to do research on their own. Instead of convincing bunch of people on the university, they have to convince many in the lay audience, who perhaps are not experts in the field, but may want to support the research anyway.
        </p>
        <p>
          Both cases of academy and independece are a spaces of big tradeoffs. For example, independend research will less likely cover the abstract problems, which are too distant for the audience. However, both academy and independent paths are meaningful and together create an interesting combination.
        </p>
        <blockquote>
          Orbit is open-source: https://github.com/andymatuschak/orbit…        

          I did this because my crowdfunding now feels increasingly solid. Patrons provide >2/3 of an NSF CAREER grant (a common "starter" grant in science). Made a (public) video reflecting on CAREER vs crowdfunding:
        </blockquote>
				<>Andy Matuschak, describes the pros and cons of being independent researcher.</>
        <p>
          Independent scientific research is <a href="https://en.wikipedia.org/wiki/Independent_scientist">not new</a>, but but appears to be increasingly more approachable and natural. So one of my theses is that there will be more people interested in the independent research in the future. 
        </p>
        <p>
          Assuming such trend will grow, couple of questions popup around the idea. How will such model stay sustainable? What will emerge around this trend? How to make it be more trouble-free for all participants?
        </p>
        <p>
          The problem space opened by these questions is huge and of course has been recurrently rediscovered by many. However, I will provide clues and interesting opportunities towards open research.
        </p>
        <h2>Web is the medium</h2>
        <p>Open access is not only about free access.</p>
        <h3>Machine readability</h3>
        <p>
          Good human access means good machine access
        </p>
        <h2>Rich human interaction</h2>
        <h2></h2>
        <h3>URL as an identifier</h3>
        <h2>Transparency and Replicability</h2>
        <h2>Analytics</h2>
        <p>
          Of course using web as a main medium allows to leverage existing state-of-the art analytics and telemetry tools. While privacy may be the concern for some, not all telemetry options cause privacy risks.
        </p>
        <p>
          Consider the automated web page quality evaluation brought by Lighthouse (open source tool developed by Google Chrome). Lighthouse evaluates web a given web page for various metrics: performance, accessibility, SEO, and more.
        </p>
        <p>
          While these metrics are  
        </p>
        <h2>Versioning</h2>
				<p>
					While these are 
				</p>
        <h2>Long term dialogue</h2>
        <p>
          I have a dream in which the diploma thesis and other academic papers are not stored on servers in PDFs, but instead are accessible 1) for human readers in the format that belongs to the current age, ie as an interactive website, 2) for computer robots in some well structured format. This applies for synthesizing papers as well as to data and code attached to them.
        </p>
      </article>
    </div>
);

export default Page;
