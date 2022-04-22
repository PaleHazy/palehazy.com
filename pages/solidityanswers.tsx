export default function Sol() {
    return (
        <div className="sol">
            <div>
                <h2>1) How to encode transaction data?</h2>
                <p>
                    <a href="https://docs.soliditylang.org/en/develop/abi-spec.html">
                        https://docs.soliditylang.org/en/develop/abi-spec.html
                    </a>
                </p>
                <p>
                    for a function call first four bytes are for the function
                    name, starting on the fifth the arguments follow
                </p>
                <img src="/types.png"></img>
            </div>
            <div>
                <h2>
                    2) When you call a DAO and DAO swaps on Uniswap, what is a
                    transaction target? Why?
                </h2>
                <p>
                    The transaction target is the address of the original
                    sender. To be able to pass this value to all of the
                    contracts being called
                </p>
            </div>
            <div>
                <h2>
                    3) Which proxy type is more optimal for DAO Modules
                    (Transparent, UUPS, Beacon, Diamond)? Why? Module is an
                    upgradeable smart contract that executes arbitrary logic
                    from the DAO side
                </h2>
                <p> For this question I Look here: <a href="https://docs.openzeppelin.com/contracts/4.x/api/proxy">https://docs.openzeppelin.com/contracts/4.x/api/proxy</a>
                    <br></br>I had to understand a bit more about what the
                    proxys role is to make a better informed choice
                    
                   
                    <div>
                        <strong>Transparent</strong> A transparent proxy, also
                        known as an inline proxy, intercepting proxy or forced
                        proxy, is a server that intercepts the connection
                        between an end-user or device and the internet. It is
                        called “transparent” because it does so without
                        modifying requests and responses
                        <a href="https://blog.openzeppelin.com/the-transparent-proxy-pattern/">
                            https://blog.openzeppelin.com/the-transparent-proxy-pattern/
                        </a>
                    </div>
                    <div>
                    <strong>UUPS</strong> <a href="https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable">https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable</a>
                    </div>
                    <strong>Beacon</strong> A proxy that retreives its
                    implementation from a beacon contract. <a href="https://docs.openzeppelin.com/contracts/3.x/api/proxy#beacon">https://docs.openzeppelin.com/contracts/3.x/api/proxy#beacon</a>
                    <div>
                        <strong>Diamond</strong>
                        <a href="https://github.com/mudgen/diamond">
                            https://github.com/mudgen/diamond
                        </a>
                        <a href="https://eips.ethereum.org/EIPS/eip-2535">
                            https://eips.ethereum.org/EIPS/eip-2535
                        </a>
                        <a href="https://forum.openzeppelin.com/t/a-more-gas-efficient-upgradeable-proxy-by-not-using-storage/4111">
                            https://forum.openzeppelin.com/t/a-more-gas-efficient-upgradeable-proxy-by-not-using-storage/4111
                        </a>
                    </div>
                </p>
                <p>From reading it seems that the Beacon is the best fit but I am not entirely sure of my answer, the reason I see is because it is the cheapest,and works well with upgradebale modules </p>
            </div>

            <div>
                <h2>
                    4) How to hash two bytes32 vars via keccak256 in the most
                    gas-efficient way? (Solidity)
                </h2>
                <a href="https://ethereum.stackexchange.com/questions/49951/compare-structs-and-arrays-with-keccak256-in-order-to-save-gas">
                    https://ethereum.stackexchange.com/questions/49951/compare-structs-and-arrays-with-keccak256-in-order-to-save-gas
                </a>
                <a href="https://medium.com/coinmonks/8-ways-of-reducing-the-gas-consumption-of-your-smart-contracts-9a506b339c0a">
                    https://medium.com/coinmonks/8-ways-of-reducing-the-gas-consumption-of-your-smart-contracts-9a506b339c0a
                </a>

                I want to answer <code style={{background: "black", color: "white"}}>keccak256(abi.encodePacked(first32, second32))</code>
                <p>creating local variables</p>
            </div>
            <div>
                <h2>5) An example of the cheapest proxy contract</h2>
                <a href="https://github.com/spalladino/ethereum-upgrade-storage-free/">
                    https://github.com/spalladino/ethereum-upgrade-storage-free/
                </a>
                <p>
                    to keep things transparent I did not know any of this
                    information off the top of my head. this is a log of the
                    steps I take to research these concepts, no matter what I
                    learned many things
                </p>
            </div>
        </div>
    );
}
