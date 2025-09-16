import NewsCard from "../components/NewsCard";
import Not1 from "../assets/noticias/Noticia1.png";
import Not2 from "../assets/noticias/Noticia2.png";
import Not3 from "../assets/noticias/Noticia3.png";
import Not4 from "../assets/noticias/Noticia4.png";

const Noticias = () => {
  const allNews = [
    {
      id: 1,
      imageSrc: Not1,
      title: "Corinthias é Campeão",
      description: "Corinthians fica com o título do Brasileirão pela sétima vez 🏆🏆",
      link: "https://www.instagram.com/p/DOlpqrWjQPU/"
    },
    {
      id: 2,
      imageSrc: Not2,
      title: "Eternizada",
      description: "Homenagem pra Alessia Russo 🤩🤩",
      link: "https://www.instagram.com/p/DOg8tfEjT0_/?img_index=1"
    },
    {
      id: 3,
      imageSrc: Not3,
      title: "Final descidida",
      description: "FINALISTAS 🏆",
      link: "https://www.instagram.com/p/DOBlhPEDWkd/"
    },
    {
      id: 4,
      imageSrc: Not4,
      title: "Historia fez Historia",
      description: "O Brasileirão Feminino está chegando ao fim, mas vale relembrar a campanha especial que o Bahia fez nessa edição 👏",
      link: "https://www.instagram.com/p/DN8SQlojbGN/?img_index=1"
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Notícias</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allNews.map(item => (
          <NewsCard
            key={item.id}
            imageSrc={item.imageSrc}
            title={item.title}
            description={item.description}
            link={item.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Noticias;