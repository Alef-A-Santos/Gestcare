function Logo({ img, alt }) {
    return (
        <div>
            <img className="w-30 h-28" src={img} alt={alt} />
        </div>

    )
}

export default Logo;