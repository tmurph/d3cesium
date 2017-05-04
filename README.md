D3 Cesium Demo Application
==========================
This demo presents San Francisco small business association loan data *a la* Hans Rosling’s compelling visualization of the “Health and Wealth of Nations”.  

This demo is largely the result of @abwood and 
@emackey ’s entry for a one day hackathon hosted at Analytical Graphics, Inc in April of 2013, which in turn built on Mike Bostock’s <a href="http://bost.ocks.org/mike/nations/">D3 recreation</a> of Hans Roslings’ 
<a href="http://www.youtube.com/watch?v=jbkSRLYSojo">“Health and Wealth of Nations”</a>.
 
Installing from the git console
================================
This sample application is setup to stay current with the Cesium repository, by use of git submodules.  To setup this application 
on a local machine, follow the instructions below.

    > git clone https://github.com/abwood/d3cesium.git
    > git submodule update --init
    > cd 3rdParty/cesium
    > Tools/apache-ant-1.8.2/bin/ant

Running the sample application locally
======================================
For convenience, a sample python file is included in this repository to simplify the setup of a webserver on a local 
machine.  With Python 2.X installed, simply run the runServer.py script to start the webserver on port 8080.


