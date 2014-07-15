The range sliders at the top change the values for the force-directed algorithm and the buttons load new graphs and apply various techniques. This will hopefully serve as a tool for teaching network analysis and visualization principles during my Gephi courses and general Networks in the Humanities presentations.

Notice this includes a pretty straightforward way to load CSV node and edge lists as exported from Gephi.

It also includes a pathfinding algorithm built for the standard data structure of force-directed networks in D3. This requires the addition of .id attributes for the nodes, however.

Now with Clustering Coefficients!

Also, it loads images for nodes but the images are not in the gist. The code also refers to different network types but the data files on Gist only refer to the transportation network.

Label sizes are based on the size of the circle element of a g, non-working hierarchical code included for no extra charge

###Original Instructions###

**Click to add nodes!** Nodes near the cursor will be linked to the new node.