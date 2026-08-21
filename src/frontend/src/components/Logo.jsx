function Logo({ img, alt }) {
    return (
        <div>
            <img className="w-18 h-18" src={img} alt={alt} />
        </div>

    )
}

export default Logo;