function Labels({ desc, className }) {
    return (
        <div className="mt-5 w-full ">
            <label className={`block ${className}`}>{desc}</label>

        </div>
    )
}

export default Labels;