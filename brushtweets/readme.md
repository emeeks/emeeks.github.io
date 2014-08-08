This is an example of using [GEXDFD3](https://github.com/emeeks/gexfd3) to host an interactive version of a dynamic k-partite network. It's still a very rough little library and feature requests and bug reports are welcome.

Simply replace cosit.gexf with your own gexf.

If it has a dynamic attribute (in this case the "startyr" column) then you can brush the network by modifying the .dynamicAttribute() setting in the index where gexfD3 is set up.

If you have a k-partite network, ensure that the types of nodes are in a "type" column and multimodal network projection buttons will automatically be created.