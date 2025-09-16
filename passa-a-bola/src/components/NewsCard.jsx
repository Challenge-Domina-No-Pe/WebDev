const NewsCard = ({ imageSrc, title, description, link }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 m-2 max-w-sm">
      <img src={imageSrc} alt={title} className="rounded-md object-cover w-full h-100" />
      <div className="p-2">
        <h3 className="text-xl font-bold mt-2 truncate">{title}</h3>
        <p className="text-gray-600 mt-2 line-clamp-2">{description}</p>
        <a href={link} className="text-blue-500 hover:underline mt-4 inline-block" target="_blank">
          Leia mais
        </a>
      </div>
    </div>
  );
};

export default NewsCard;