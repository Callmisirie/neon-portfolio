const ReviewCard = ({customerName, feedback}) => {
  return (
    <div className="flex justify-center 
    items-center flex-col">
        <h3 className="mt-1 font-palanquin 
        text-3xl font-bold text-center">
            {customerName}
        </h3>
        <p className="mt-6 max-w-sm 
        text-center info-text">
            {feedback}
        </p>
    </div>
  )
}
export default ReviewCard;