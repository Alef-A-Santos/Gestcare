function Labels({ desc, className }) {
    return (
        <div className="mt-5 w-full flex  justify-center sm:justify-start ">
            <label className={className} >{desc}</label>

        </div>
    )
}

export default Labels;