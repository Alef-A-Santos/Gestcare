import Card from "./Card";
import Badge from "./Badge";
 
function CardMedia({ media, nivel }) {
  return (
    <Card titulo="Média das medições">
      <p className="text-4xl font-poppins font-bold text-teal-500 text-center">
        {media}
      </p>
      <div className="flex justify-center mt-3">
        <Badge nivel={nivel} />
      </div>
    </Card>
  );
}
 
export default CardMedia;