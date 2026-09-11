function Logo({ img, alt }) {
    return (
        <div>
            <img className="w-15 h-15  md:w-28  md:h-28" src={img} alt={alt} />
        </div>
    
    )
}

export default Logo;