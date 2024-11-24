import { subjectService } from '@/services/client/common/ClientServices/SubjectService';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Higher-Order Component to inject the `router` and handle protected routes
function withRouter(WrappedComponent: any) {
  return function (props: any) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    // subjectService.getAuthData().subscribe((res:any)=>{  })
    useEffect(() => {
      // Check if the user is authenticated (using localStorage, cookies, etc.)
      const user = true//localStorage.getItem('user'); // Replace this with your actual authentication check

      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // router.push('/roles'); // Redirect to login page if not authenticated
      }
    }, [router]);

    // Render a loading state until the authentication check is complete
    if (isAuthenticated === null) {
      return <div>Loading...</div>; // Optionally show a loading spinner or message
    }

    // If authenticated, render the wrapped component
    if (isAuthenticated) {
      return <WrappedComponent {...props} router={router} />;
    }

    return null; // Do not render the wrapped component if not authenticated
  };
}

export default withRouter;


// import { useRouter } from 'next/navigation';

// // Higher-Order Component to inject the `router`
// function withRouter(WrappedComponent: any) {
//   return function (props: any) {
//     const router = useRouter();
//     return <WrappedComponent {...props} router={router} />;
//   };
// }

// export default withRouter;