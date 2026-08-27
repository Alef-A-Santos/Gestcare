function Logo({ img, alt }) {
    return (
        <div>
            <img className="w-15 h-15 md:w-25 md:h-25" src={img} alt={alt} />
        </div>

    )
}

export default Logo;