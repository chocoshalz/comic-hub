import { useSearchParams, useRouter } from 'next/navigation';

// Functional wrapper to handle search parameters
function withSearchParams(WrappedComponent: any) {
  return function (props: any) {
    const searchParams = useSearchParams();
    const router = useRouter();
    return <WrappedComponent {...props} searchParams={searchParams} router={router} />;
  };
}

export default withSearchParams;