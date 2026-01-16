import type { NextConfig } from "next";

const nextConfig: NextConfig = {
        images: {
          dangerouslyAllowSVG:true,
      
          remotePatterns:[
            {
              protocol:'https',
              hostname:'*',
            }
          ]
        },
        experimental: {
          ppr: false, 
          serverActions: {
      bodySizeLimit: '10mb', 
    },
         
        }, 
      
};

export default nextConfig;
