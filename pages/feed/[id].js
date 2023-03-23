import styles from '../../styles/Feed.module.css';
import { useRouter } from 'next/router';

export const Feed = ({ articles, pageNumber }) => {
    const router = useRouter();
    return (
        <>
            <div className={styles.main}>
                {articles.map((article, index) => (
                    <div key={index} className={styles.post}>
                        <h1 onClick={() => (window.location.href = article.url)}>{article.title}</h1>
                        <p>{article.description}</p>
                        {!!article.urlToImage && <img src={article.urlToImage} />}
                    </div>
                ))}
            </div>
            <div className={styles.paginator}>
                <div
                    className={pageNumber === 1 ? styles.disabled : styles.active}
                    onClick={() => {
                        if (pageNumber > 1) {
                            router.push(`/feed/${pageNumber - 1}`)
                        }
                    }}
                >
                    Previous Page
                </div>
                <div>#{pageNumber}</div>
                <div
                    className={pageNumber === 5 ? styles.disabled : styles.active}
                    onClick={() => {
                        if (pageNumber < 5) {
                            router.push(`/feed/${pageNumber + 1}`)
                        }
                    }}
                >
                    Next Page
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = async pageContext => {
    const pageNumber = pageContext.query.id;

    if (!pageNumber || pageNumber < 1 || pageNumber > 5) {
        return {
            props: {
                articles: [],
                pageNumber: 1,
            },
        };
    }

    const apiResponse = await fetch(
        `https://newsapi.org/v2/everything?q=tesla&from=2023-02-23&sortBy=publishedAt&apiKey=a4ee0239c03247a4adc9559d75da0465`,
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_NEWS_KEY}`,
            },
        },
    );
    
    const json = await apiResponse.json();
    const { articles } = json;

    return {
        props: {
            articles,
            pageNumber: Number.parseInt(pageNumber),
        },
    };
};

export default Feed;
