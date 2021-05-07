import Link from 'next/link'
import { Tweet } from 'react-static-tweets'

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
          I am very close to the trend of developers who are able to develop various flagship projects with the support of the community. Recently, I have noticed that there are cases of researchers who, similarly, took the bet and try to do their research on their own. 
        </p>
        <p>
					Instead of convincing buch of people on the university, they have to convince many lay people, who perhaps are not experts in the field, but may want to back the research anyway.
        </p>
        <p>
          Both cases of academy and independece are a space of big tradeoffs. For example, independend research will less likely cover the hard, abstract problems, which are too distant for the lay people. 
        </p>
				<Tweet id="1389972119719616512" />
				<>Andy Matuschak, describes the pros and cons of being independent researcher.</>
				<p>
					However, both academy and independent paths are meaningful and together create great combination.
				</p>
        <p>
          So one of my theses is that there will be more people interested in the independent research in the future. 
        </p>
        <p>
          Assuming such trend will grow, couple of questions popup around the idea. How will such model stay sustainable? Will some kind of structure emerge around this trend, which will make it be more convenient?
        </p>
        <h2>Lowering unnnecessary entry barriers</h2>
				<Tweet id="1375596258023370755" />
        <h2>Transparency and Replicability</h2>
				<Tweet id="1375596258023370755" />
        <h2>Leveraging the web</h2>
				<p>
					While these are 
				</p>
				<Tweet id="1304450907921285121" />
        <h2>Long term dialogue</h2>
        <p>
          I have a dream in which the diploma thesis and other academic papers are not stored on servers in PDFs, but instead are accessible 1) for human readers in the format that belongs to the current age, ie as an interactive website, 2) for computer robots in some well structured format. This applies for synthesizing papers as well as to data and code attached to them.
        </p>
      </article>
    </div>
);

export default Page;
