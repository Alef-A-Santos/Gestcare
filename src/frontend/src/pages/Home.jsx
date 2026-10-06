import Sidebar from "../components/Sidebar";
function Home() {
    return (
        <div className="min-h-screen flex ">
            <div className="w-3/10 min-h-screen">
                <Sidebar/>
            </div>
            <div className="w-full bg-pink-100 p-5">
                <main >
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum alias nemo quibusdam voluptate, numquam omnis nam, cupiditate aliquam nulla harum voluptates deserunt ullam pariatur dolore? Ab officiis quisquam eaque architecto?</p>
                </main>

            </div>
        </div>
    )
}

export default Home;