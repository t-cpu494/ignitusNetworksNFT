//SPDX-License-Identifier: GPL - 3.0
pragma solidity >= 0.7.0 < 0.9.0;

contract ignitusNetworksNFTmarketplace {
    struct NFT {
        uint id;
        uint price;
        bool soldOrNot;
    }

    NFT[] public display;
    address seller;
    
    constructor(address _seller) {
    seller = _seller;
    display.push(NFT(1, 10, false));
    display.push(NFT(2, 15, false));
    display.push(NFT(3, 20, false));
    display.push(NFT(4, 25, false));
    }

    uint[] public cart;

    function buy(uint picId) public {
        require(display[picId - 1].soldOrNot == false, "Sold!");
        cart.push(picId);
    }

    function remove(uint picId) public {
        for(uint i = 0; i < cart.length; i++) {
            if(cart[i] == picId) {
                cart[i] = 0;
            }
        }
    }

    function pay() public {
        uint sum = 0;
        for(uint i = 0; i < cart.length; i++) {
            if(cart[i] == 0) {
                continue;
            }
            else {
                display[cart[i] - 1].soldOrNot = true;
                sum += display[cart[i] - 1].price;
            }
        }
        payable(seller).transfer(sum);
        
        while(cart.length != 0) {
            cart.pop();
        }
    }


}