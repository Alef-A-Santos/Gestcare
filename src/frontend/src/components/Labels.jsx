function Labels({ desc, className }) {
    return (
        <div className="mt-3 w-full flex justify-start sm:justify-start ">
            <label className={className} >{desc}</label>

        </div>
    )
}

export default Labels;